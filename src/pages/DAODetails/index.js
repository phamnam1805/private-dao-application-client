import { Box } from "@material-ui/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import useLowerAddressParam from "src/hook/useLowerAddressParam";
import GroupTabButton from "./components/GroupTabButton";
import DAOInfo from "./DAOInfo";
import DAOLayoutWrapper from "./components/DAOLayoutWrapper";
import Empty from "src/components/Icon/Empty";

function DAODetailsLayout() {
  const { daoAddress } = useLowerAddressParam();
  const { daos } = useSelector((state) => state.daoDataSlice);

  const daoData = useMemo(() => {
    return daos.filter(dao => dao.address.toLowerCase() == daoAddress)[0];
  }, [daos]);

  return (
    <>
      {daoData ? (
        <>
          <GroupTabButton defaultActive={0} />
          <DAOInfo dao={daoData} />
        </>
      ) : (
        <Box py={2} display="flex" justifyContent="center">
          <Empty title="No Data" iconProps={{ style: { fontSize: "60px" } }} />
        </Box>
      )}

    </>
  );
}

export default function DAODetails() {
  return (
    <DAOLayoutWrapper>
      <DAODetailsLayout />
    </DAOLayoutWrapper>
  );
}
