import { Route, Navigate } from "react-router-dom";
import NetworkLayout from "./NetworkLayout";
import MissionSelect from "./pages/MissionSelect";
import MissionBuilder from "./pages/MissionBuilder";
import CableChallenge from "./pages/CableChallenge";

export const networkRoutes = (
  <Route path="/network" element={<NetworkLayout />}>
    <Route index element={<Navigate to="1" replace />} />
    <Route path=":id" element={<MissionSelect />} />
    <Route path=":id/build" element={<MissionBuilder />} />
    <Route path=":id/challenge" element={<CableChallenge />} />
  </Route>
);
