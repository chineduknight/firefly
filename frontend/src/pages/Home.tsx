import { Flex } from "@chakra-ui/react";
import { Suspense, lazy } from "react";
import PokemonHomeHeader from "../components/pokemon/PokemonHomeHeader";
import PokemonHomeListSection from "../components/pokemon/PokemonHomeListSection";

const PokemonDetailsDialog = lazy(
  () => import("../components/pokemon/PokemonDetailsDialog")
);

const Home = () => {
  return (
    <Flex direction="column" minH="100vh">
      <PokemonHomeHeader />
      <PokemonHomeListSection />
      <Suspense fallback={null}>
        <PokemonDetailsDialog />
      </Suspense>
    </Flex>
  );
};

export default Home;
