import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import MenuPage from "@/pages/menuPage";
import SinglePlayerGame from "@/pages/singlePlayer";
import HowToPlay from "@/pages/howToPlay";
import TwoPlayer from "@/pages/twoPlayer";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<MenuPage />}></Route>
            <Route path="/single-player" element={<SinglePlayerGame />}></Route>
            <Route path="/two-player" element={<TwoPlayer />}></Route>
            <Route path="/how-to-play" element={<HowToPlay />}></Route>
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};

export default Layout;