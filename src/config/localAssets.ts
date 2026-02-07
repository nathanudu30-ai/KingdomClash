export const localAssetPaths = {
  backgrounds: {
    menuPlay01: 'assets/backgrounds/99C5E711-FBAF-4D1E-8F52-CA7DA9DCF8AF.png',
    menuPlay02: 'assets/backgrounds/47E77586-F7C8-4CB6-9F13-A9E3CAAAFD66.png',
    menuPlay03: 'assets/backgrounds/F7DD078F-B815-49EC-88A7-B6BC6CF04794.png',
    menuPlay04: 'assets/backgrounds/CC864469-9F6F-477C-B015-0F1E00740284.png',
    menuPlay05: 'assets/backgrounds/6227C425-D647-4197-AB64-34A0E3D0E6DE.png',
    menuPlay06: 'assets/backgrounds/76AF37B7-2EE2-40C4-A553-7274DBBE75B7.png',
    menuPlay07: 'assets/backgrounds/80C7ADE0-93E3-4130-B273-5FB44E3922B4.png',
    menuPlay08: 'assets/backgrounds/F2C12F66-4FCC-457A-A55A-946DD6C0DE46.png',
    menuPlay09: 'assets/backgrounds/11809D44-F58A-4FC7-99A4-01FDBE2A4075.png',
    menuPlay10: 'assets/backgrounds/31F59197-C93D-477F-B997-BDCED4F06C73.png',
    menuPlay11: 'assets/backgrounds/143D29D3-21B3-46C5-8392-0C3CC0CB2656.png',
    menuPlay12: 'assets/backgrounds/737DB56D-B270-4024-B506-82C5484ED89D.png',
  },
  machine: {
    frameNeon: 'assets/machine/F30B5728-1DA4-4CFF-B401-E58D10A8D1F5.png',
  },
  tokens: {
    token01: 'assets/tokens/4960FB9B-107D-4507-8C1D-5B6D89FBDDF0.png',
    token02: 'assets/tokens/B6F1563D-6D0F-429D-A9B4-DBD3DA515036.png',
    token03: 'assets/tokens/D28F2013-35DA-44A6-9439-396BEF8D375D.png',
    token04: 'assets/tokens/B703E926-8A7B-457A-9616-4D788EF9ACF7.png',
    token05: 'assets/tokens/8D4140A2-606D-444A-91FA-6ED2441C2A03.png',
    token06: 'assets/tokens/AE2526E6-FC04-4319-85B0-F0AAF49C4515.png',
    token07: 'assets/tokens/7BE44C88-717E-4D3C-8C12-4C05482E47DC.png',
    token08: 'assets/tokens/0969E50B-16FF-48D8-A3CC-AC25961EE00E.png',
  },
} as const;

/**
 * Optionnel: quand les fichiers existent, remplace cette map par des `require(...)` statiques
 * pour un usage direct dans les composants React Native.
 */
export const localAssetRequires = {
  backgrounds: [
    require('../../assets/backgrounds/99C5E711-FBAF-4D1E-8F52-CA7DA9DCF8AF.png'),
    require('../../assets/backgrounds/47E77586-F7C8-4CB6-9F13-A9E3CAAAFD66.png'),
    require('../../assets/backgrounds/F7DD078F-B815-49EC-88A7-B6BC6CF04794.png'),
    require('../../assets/backgrounds/CC864469-9F6F-477C-B015-0F1E00740284.png'),
    require('../../assets/backgrounds/6227C425-D647-4197-AB64-34A0E3D0E6DE.png'),
    require('../../assets/backgrounds/76AF37B7-2EE2-40C4-A553-7274DBBE75B7.png'),
    require('../../assets/backgrounds/80C7ADE0-93E3-4130-B273-5FB44E3922B4.png'),
    require('../../assets/backgrounds/F2C12F66-4FCC-457A-A55A-946DD6C0DE46.png'),
    require('../../assets/backgrounds/11809D44-F58A-4FC7-99A4-01FDBE2A4075.png'),
    require('../../assets/backgrounds/31F59197-C93D-477F-B997-BDCED4F06C73.png'),
    require('../../assets/backgrounds/143D29D3-21B3-46C5-8392-0C3CC0CB2656.png'),
    require('../../assets/backgrounds/737DB56D-B270-4024-B506-82C5484ED89D.png'),
  ],
  machine: {
    frameNeon: require('../../assets/machine/F30B5728-1DA4-4CFF-B401-E58D10A8D1F5.png'),
  },
  tokens: {
    token01: require('../../assets/tokens/4960FB9B-107D-4507-8C1D-5B6D89FBDDF0.png'),
    token02: require('../../assets/tokens/B6F1563D-6D0F-429D-A9B4-DBD3DA515036.png'),
    token03: require('../../assets/tokens/D28F2013-35DA-44A6-9439-396BEF8D375D.png'),
    token04: require('../../assets/tokens/B703E926-8A7B-457A-9616-4D788EF9ACF7.png'),
    token05: require('../../assets/tokens/8D4140A2-606D-444A-91FA-6ED2441C2A03.png'),
    token06: require('../../assets/tokens/AE2526E6-FC04-4319-85B0-F0AAF49C4515.png'),
    token07: require('../../assets/tokens/7BE44C88-717E-4D3C-8C12-4C05482E47DC.png'),
    token08: require('../../assets/tokens/0969E50B-16FF-48D8-A3CC-AC25961EE00E.png'),
  },
};
