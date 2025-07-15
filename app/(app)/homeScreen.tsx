import { View, Text, Button } from "react-native";
import { useSession } from "../ctx";
export default function HomeScreen() {
  const { signOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View>
      <View>
        <Text style={{ color: "black" }}>Welcome to the Home Screen! 🎉</Text>
        <Button title="Sign Out" onPress={async () => await handleSignOut()} />
      </View>
    </View>
  );
}
