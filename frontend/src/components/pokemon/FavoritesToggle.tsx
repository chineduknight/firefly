import { Flex, Switch } from "@chakra-ui/react";

interface FavoritesToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const FavoritesToggle = ({ value, onChange }: FavoritesToggleProps) => (
  <Flex align="center" gap={2} mb={3}>
    <Switch.Root
      checked={value}
      onCheckedChange={(e) => onChange(e.checked)}
      colorPalette="teal"
    >
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Show favorites only</Switch.Label>
    </Switch.Root>
  </Flex>
);

export default FavoritesToggle;
