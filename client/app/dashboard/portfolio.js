import { View, Button, Linking } from 'react-native';

export default function PortfolioScreen() {
  const openPortfolio = () => {
    Linking.openURL('http://3.108.254.144:5000/'); // replace with your actual link
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Portfolio Website" onPress={openPortfolio} />
    </View>
  );
}
