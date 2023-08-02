import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import RequestTable from "./RequestTable";

export default function Request() {
  const requestListData = [
    {
      requestID: "0x123123123123123123123123123123123123123123123123123123123",
      requestor: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
      keyID: "2",
      state: 2,
    },
    {
      requestID: "0x123123123123123123123123123123123123123123123123123123123",
      requestor: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
      keyID: "1",
      state: 1,
    },
    {
      requestID: "0x123123123123123123123123123123123123123123123123123123123",
      requestor: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
      keyID: "0",
      state: 0,
    },
  ];

  return (
    <MainLayoutWrapper
      overview={{
        title: "Key Requests",
        des: "Generated distributed keys can be used for Threshold Homomorphic Encryption through key usage requests",
      }}
    >
      <RequestTable requestListData={requestListData} />
    </MainLayoutWrapper>
  );
}
