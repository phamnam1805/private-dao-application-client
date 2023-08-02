import { Committee } from "distributed-key-generation";
import { COMMITTEE, CONTRIBUTION_TYPE } from "src/configs/constance";
import { readContributionData } from "src/redux/dkgDataSlice";

export function generateRound1Contribution(index) {
  let x = [], y = [];
  const data = Committee.getRandomPolynomial(index, COMMITTEE.T, COMMITTEE.N);
  for (let i = 0; i < COMMITTEE.T; i++) {
    x.push(data.C[i][0]);
    y.push(data.C[i][1]);
  }
  return {
    committeeData: data,
    contribution: [x, y],
  };
}

export async function generateRound2Contribution(
  round1Contribution,
  round1DataSubmissions,
) {
  let recipientIndexes = [];
  let recipientPublicKeys = [];
  let f = [];
  for (let j = 0; j < round1DataSubmissions.length; j++) {
    let round1DataSubmission = round1DataSubmissions[j];
    let recipientIndex = round1DataSubmission.senderIndex;
    if (Number(recipientIndex) != Number(round1Contribution.secret.i)) {
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
  console.log(recipientIndexes, recipientPublicKeys, f);
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

  return {
    committeeData: {
      ciphers: round2Contribution.ciphers,
    },
    contribution: [
      round1Contribution.secret.i,
      recipientIndexes,
      round2Contribution.ciphers,
      proof
    ],
  };
}