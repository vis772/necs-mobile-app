export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'drinks' | 'food';
  isSpecialty: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'drink-1',
    name: 'Championship Latte',
    description: 'Espresso with steamed milk and vanilla',
    category: 'drinks',
    isSpecialty: true,
  },
  {
    id: 'drink-2',
    name: 'Gamer Fuel Energy',
    description: 'Cold brew with energy boost',
    category: 'drinks',
    isSpecialty: true,
  },
  {
    id: 'drink-3',
    name: 'Victory Smoothie',
    description: 'Mixed berry protein smoothie',
    category: 'drinks',
    isSpecialty: true,
  },
  {
    id: 'drink-4',
    name: 'Iced Coffee',
    description: 'Classic cold brew over ice',
    category: 'drinks',
    isSpecialty: false,
    isPopular: true,
  },
  {
    id: 'drink-5',
    name: 'Green Tea',
    description: 'Premium matcha green tea',
    category: 'drinks',
    isSpecialty: false,
  },
  {
    id: 'drink-6',
    name: 'Water',
    description: 'Refreshing bottled water',
    category: 'drinks',
    isSpecialty: false,
  },
  {
    id: 'food-1',
    name: 'MVP Burger',
    description: 'Premium beef burger with special sauce',
    category: 'food',
    isSpecialty: true,
  },
  {
    id: 'food-2',
    name: 'Victory Wings',
    description: 'Spicy buffalo chicken wings',
    category: 'food',
    isSpecialty: true,
  },
  {
    id: 'food-3',
    name: 'Power Wrap',
    description: 'Grilled chicken wrap with veggies',
    category: 'food',
    isSpecialty: false,
    isPopular: true,
  },
  {
    id: 'food-4',
    name: 'Nachos Supreme',
    description: 'Loaded nachos with cheese and toppings',
    category: 'food',
    isSpecialty: false,
  },
  {
    id: 'food-5',
    name: 'Pizza Slice',
    description: 'Fresh pepperoni pizza slice',
    category: 'food',
    isSpecialty: false,
  },
  {
    id: 'food-6',
    name: 'Energy Bars',
    description: 'Protein-packed energy bars',
    category: 'food',
    isSpecialty: false,
    isNew: true,
  },
];

export const getMenuItemsByCategory = (category: 'drinks' | 'food'): MenuItem[] => {
  return MENU_ITEMS.filter(item => item.category === category);
};

export const getSpecialtyItems = (): MenuItem[] => {
  return MENU_ITEMS.filter(item => item.isSpecialty);
};
