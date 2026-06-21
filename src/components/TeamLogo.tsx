import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';

type Props = {
  logo: string;
  size?: number;
  fallback?: string; // حرف أو إيموجي عند فشل تحميل الصورة
};

function isUrl(str: string): boolean {
  return str.startsWith('http://') || str.startsWith('https://');
}

export default function TeamLogo({ logo, size = 44, fallback = '⚽' }: Props) {
  const [failed, setFailed] = useState(false);

  if (isUrl(logo) && !failed) {
    return (
      <Image
        source={{ uri: logo }}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onError={() => setFailed(true)}
      />
    );
  }

  const fontSize = size * 0.75;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize }}>{failed ? fallback : logo}</Text>
    </View>
  );
}
