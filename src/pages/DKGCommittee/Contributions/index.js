import { Committee, Utils } from "distributed-key-generation";
import { COMMITTEE, CONTRIBUTION_TYPE } from "src/configs/constance";
import { defaultClient } from "src/services/requestClient";
import { BASE_FUNDING } from "src/configs/constance";

export function generateRound1Contribution(index) {
  let x = [], y = [];
  const data = Committee.getRandomPolynomial(COMMITTEE.T, COMMITTEE.N);
  for (let i = 0; i < COMMITTEE.T; i++) {
    x.push(data.C[i][0]);
    y.push(data.C[i][1]);
  }
  return {
    committeeData: { ...data, ...{ senderIndex: index } },
    contribution: [x, y],
  };
}

export async function generateRound2Contribution(round1Contribution, round1DataSubmissions) {
  let recipientIndexes = [];
  let recipientPublicKeys = [];
  let f = [];
  for (let j = 0; j < round1DataSubmissions.length; j++) {
    let round1DataSubmission = round1DataSubmissions[j];
    let recipientIndex = round1DataSubmission.senderIndex;
    if (Number(recipientIndex) != Number(round1Contribution.senderIndex)) {
      recipientIndexes.push(recipientIndex);
      let recipientPublicKeyX = BigInt(round1DataSubmission.x[0]);
      let recipientPublicKeyY = BigInt(round1DataSubmission.y[0]);
      recipientPublicKeys.push([
        recipientPublicKeyX,
        recipientPublicKeyY,
      ]);
      f.push(BigInt(round1Contribution.f[recipientIndex]));
    }
  }

  const round2Contribution = Committee.getRound2Contributions(
    recipientIndexes,
    recipientPublicKeys,
    f,
    round1Contribution.C
  );

  let { proof, publicInput } = await window.snarkjs.groth16.fullProve(
    round2Contribution.circuitInput,
    "/wasm/round-2-contribution.wasm",
    "/zkey/round-2-contribution_final.zkey"
  );

  proof = Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);

  return {
    committeeData: {
      ciphers: round2Contribution.ciphers,
    },
    contribution: [
      round1Contribution.senderIndex,
      recipientIndexes,
      round2Contribution.ciphers,
      proof
    ],
  };
}

export async function generateTallyContribution(keyGenContribution, round2DataSubmissions, R) {
  let u = [];
  let c = [];
  const round2Contributions = round2DataSubmissions.filter(e => e.recipientIndex == keyGenContribution.senderIndex)[0].dataSubmissions;
  for (let i = 0; i < COMMITTEE.N - 1; i++) {
    u.push([
      BigInt(BigInt(round2Contributions[i].ciphers[0])),
      BigInt(BigInt(round2Contributions[i].ciphers[1])),
    ]);
    c.push(BigInt(round2Contributions[i].ciphers[2]));
  }
  const tallyContribution = Committee.getTallyContribution(
    keyGenContribution.senderIndex,
    keyGenContribution.C,
    keyGenContribution.a0,
    keyGenContribution.f[keyGenContribution.senderIndex],
    u, c,
    R.map(v => v.map(e => BigInt(e))),
  );

  let { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    tallyContribution.circuitInput,
    "/wasm/tally-contribution_dim3.wasm",
    "/zkey/tally-contribution_dim3_final.zkey",
  );
  proof = Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);
  return {
    contribution: [
      keyGenContribution.senderIndex,
      tallyContribution.D,
      proof,
    ]
  };
}

export async function bruteForceResult(resultVector, totalFunded = null) {
  const reqBody = !totalFunded ? { resultVector: resultVector } : {
    resultVector: resultVector,
    totalValue: totalFunded / BASE_FUNDING
  };
  const res = await defaultClient.post("/committee/brute-forces", reqBody);
  const tallyResult = res["data"].result ? res["data"].result.map(e => e * BASE_FUNDING) : [];
  return tallyResult;
}

export async function generateResultSubmission(tallyDataSubmissions, _M, _result) {
  let listIndex = [];
  let D = [];
  for (let i = 0; i < tallyDataSubmissions.length; i++) {
    let tallyDataSubmission = tallyDataSubmissions[i];
    listIndex.push(Number(tallyDataSubmission.senderIndex));
    D[i] = [];
    // FIXME DIM=3
    for (let j = 0; j < 3; j++) {
      D[i].push([
        BigInt(tallyDataSubmission.Di[j][0]),
        BigInt(tallyDataSubmission.Di[j][1]),
      ]);
    }
  }
  const M = _M.map(v => v.map(e => BigInt(e)));
  const result = _result.map(e => BigInt(e));
  let lagrangeCoefficient = Utils.getBigIntArray(
    Committee.getLagrangeCoefficient(listIndex)
  );
  let { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    { lagrangeCoefficient: lagrangeCoefficient, D: D, M: M, result: result },
    "/wasm/result-verifier_dim3.wasm",
    "/zkey/result-verifier_dim3_final.zkey",
  );

  proof = Utils.genSolidityProof(proof.pi_a, proof.pi_b, proof.pi_c);

  return {
    submission: {
      result: result,
      proof: proof,
    }
  };
}

