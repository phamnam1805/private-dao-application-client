import { useSelector } from "react-redux";
import MainLayoutWrapper from "src/components/Wrappers/MainLayoutWrapper";
import useLowerAddressParam from "src/hook/useLowerAddressParam";

export default function DAOLayoutWrapper({ children, ...props }) {
  const { daoAddress } = useLowerAddressParam();

  const daoName = "The PAO";
  const daoDescription =
    "The protocol addresses the privacy issue for investors, encompassing both the privacy of the amount of money they have invested and the privacy of voting on project operations through proposals.";

  return (
    <MainLayoutWrapper
      overview={{
        title: daoName,
        des: daoDescription,
        back: "/",
      }}
    >
      {children}
    </MainLayoutWrapper>
  );
}
