import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Coffee, ShoppingBag, Gift, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { MENU_ITEMS, MenuItem } from '@/mocks/menuItems';
import { MERCHANDISE, MerchItem } from '@/mocks/merchandise';

type StoreTab = 'menu' | 'merch';

export default function StoreScreen() {
  console.log('[StoreScreen] Rendering...');
  const [activeTab, setActiveTab] = useState<StoreTab>('menu');
  const router = useRouter();

  const specialtyItems = MENU_ITEMS.filter(item => item.isSpecialty);
  const drinks = MENU_ITEMS.filter(item => item.category === 'drinks');
  const food = MENU_ITEMS.filter(item => item.category === 'food');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradientBackground}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Store</Text>
            <Text style={styles.headerSubtitle}>Fuel Up & Gear Up</Text>
          </View>
        </SafeAreaView>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.tabActive]}
            onPress={() => setActiveTab('menu')}
            accessibilityLabel="Menu tab"
          >
            <Coffee size={20} color={activeTab === 'menu' ? Colors.white : Colors.gray} />
            <Text style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}>
              Menu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'merch' && styles.tabActive]}
            onPress={() => setActiveTab('merch')}
            accessibilityLabel="Merchandise tab"
          >
            <ShoppingBag size={20} color={activeTab === 'merch' ? Colors.white : Colors.gray} />
            <Text style={[styles.tabText, activeTab === 'merch' && styles.tabTextActive]}>
              Merchandise
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.rewardsCard}
            onPress={() => router.push('/rewards' as any)}
            activeOpacity={0.8}
            accessibilityLabel="View rewards program"
          >
            <LinearGradient
              colors={['#FF6B6B', '#4ECDC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rewardsGradient}
            >
              <View style={styles.rewardsContent}>
                <Gift size={28} color={Colors.white} />
                <View style={styles.rewardsText}>
                  <Text style={styles.rewardsTitle}>Earn Rewards</Text>
                  <Text style={styles.rewardsSubtitle}>
                    Purchase and review to unlock rewards
                  </Text>
                </View>
                <ChevronRight size={24} color={Colors.white} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {activeTab === 'menu' && (
            <>
              {specialtyItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>SPECIALTIES</Text>
                  {specialtyItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} isSpecialty />
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>DRINKS</Text>
                {drinks.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>FOOD</Text>
                {food.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </View>
            </>
          )}

          {activeTab === 'merch' && (
            <View style={styles.merchGrid}>
              {MERCHANDISE.map((item) => (
                <MerchItemCard key={item.id} item={item} />
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function MenuItemCard({ item, isSpecialty }: { item: MenuItem; isSpecialty?: boolean }) {
  return (
    <View style={[styles.menuCard, isSpecialty && styles.menuCardSpecialty]}>
      <View style={styles.menuCardContent}>
        <View style={styles.menuCardHeader}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          {isSpecialty && (
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyBadgeText}>SPECIALTY</Text>
            </View>
          )}
          {item.isPopular && !isSpecialty && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>POPULAR</Text>
            </View>
          )}
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.reviewButton} accessibilityLabel="Review to earn rewards">
          <Gift size={14} color={Colors.accent} />
          <Text style={styles.reviewButtonText}>Review to Earn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MerchItemCard({ item }: { item: MerchItem }) {
  return (
    <View style={styles.merchCard}>
      <View style={styles.merchImagePlaceholder}>
        <ShoppingBag size={32} color={Colors.gray} />
      </View>
      <View style={styles.merchCardContent}>
        <View style={styles.merchCardHeader}>
          <Text style={styles.merchCategory}>{item.category.toUpperCase()}</Text>
          {item.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerBadgeText}>★</Text>
            </View>
          )}
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={styles.merchItemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.merchItemDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.merchActions}>
          <TouchableOpacity style={styles.viewButton} accessibilityLabel={`View ${item.name}`}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.earnButton} accessibilityLabel="Earn rewards with this item">
            <Gift size={14} color={Colors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.accent,
    marginTop: 2,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tabActive: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray,
  },
  tabTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  rewardsCard: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rewardsGradient: {
    padding: 20,
  },
  rewardsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rewardsText: {
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
  },
  rewardsSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  menuCardSpecialty: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  menuCardContent: {
    gap: 8,
  },
  menuCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  specialtyBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  specialtyBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  popularBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  newBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  menuItemDescription: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  reviewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  merchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  merchCard: {
    width: '48%',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  merchImagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchCardContent: {
    padding: 12,
    gap: 6,
  },
  merchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  merchCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gray,
    letterSpacing: 0.5,
    flex: 1,
  },
  bestSellerBadge: {
    backgroundColor: Colors.warning,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerBadgeText: {
    fontSize: 10,
    color: Colors.white,
  },
  merchItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    minHeight: 32,
  },
  merchItemDescription: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '500',
    minHeight: 28,
  },
  merchActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  viewButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  earnButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
