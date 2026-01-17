export type MerchCategory = 'hoodies' | 'tshirts' | 'crewnecks' | 'hats' | 'scarves' | 'other';

export interface MerchItem {
  id: string;
  name: string;
  category: MerchCategory;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const MERCHANDISE: MerchItem[] = [
  {
    id: 'merch-1',
    name: 'NECS 2026 Hoodie',
    category: 'hoodies',
    description: 'Official championship hoodie',
    isBestSeller: true,
  },
  {
    id: 'merch-2',
    name: 'Team Logo Hoodie',
    category: 'hoodies',
    description: 'Premium team hoodie',
  },
  {
    id: 'merch-3',
    name: 'Championship Tee',
    category: 'tshirts',
    description: 'Official tournament t-shirt',
    isBestSeller: true,
  },
  {
    id: 'merch-4',
    name: 'Player Jersey Tee',
    category: 'tshirts',
    description: 'Support your favorite player',
  },
  {
    id: 'merch-5',
    name: 'Esports Tee',
    category: 'tshirts',
    description: 'Classic esports design',
  },
  {
    id: 'merch-6',
    name: 'Premium Crewneck',
    category: 'crewnecks',
    description: 'Comfortable cotton crewneck',
  },
  {
    id: 'merch-7',
    name: 'NECS Crewneck',
    category: 'crewnecks',
    description: 'Official event crewneck',
    isNew: true,
  },
  {
    id: 'merch-8',
    name: 'Snapback Cap',
    category: 'hats',
    description: 'Adjustable snapback hat',
    isBestSeller: true,
  },
  {
    id: 'merch-9',
    name: 'Beanie',
    category: 'hats',
    description: 'Warm winter beanie',
  },
  {
    id: 'merch-10',
    name: 'Team Scarf',
    category: 'scarves',
    description: 'Show your team pride',
  },
  {
    id: 'merch-11',
    name: 'Championship Scarf',
    category: 'scarves',
    description: 'Official NECS scarf',
  },
  {
    id: 'merch-12',
    name: 'Sticker Pack',
    category: 'other',
    description: 'Team and tournament stickers',
  },
  {
    id: 'merch-13',
    name: 'Keychain',
    category: 'other',
    description: 'Metal team logo keychain',
  },
  {
    id: 'merch-14',
    name: 'Phone Case',
    category: 'other',
    description: 'Custom esports phone case',
    isNew: true,
  },
];

export const getMerchByCategory = (category: MerchCategory): MerchItem[] => {
  return MERCHANDISE.filter(item => item.category === category);
};

export const getBestSellers = (): MerchItem[] => {
  return MERCHANDISE.filter(item => item.isBestSeller);
};
