import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Gift, ShoppingBag, Coffee, Star, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function RewardsScreen() {
  console.log('[RewardsScreen] Rendering...');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Rewards',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '800',
          },
        }}
      />

      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <Gift size={48} color={Colors.white} />
              <Text style={styles.heroTitle}>Rewards Program</Text>
              <Text style={styles.heroSubtitle}>
                Earn rewards with every purchase and review
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>YOUR PROGRESS</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progress to Next Reward</Text>
                <Text style={styles.progressLabel}>0 / —</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: '0%' }]} />
                </View>
              </View>
              <Text style={styles.progressNote}>
                Complete actions below to earn rewards
              </Text>
            </View>
          </View>

          <View style={styles.earnMethodsSection}>
            <Text style={styles.sectionTitle}>HOW TO EARN</Text>
            
            <View style={styles.methodCard}>
              <View style={styles.methodIconContainer}>
                <Coffee size={28} color={Colors.white} />
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Buy Drinks & Food</Text>
                <Text style={styles.methodDescription}>
                  Earn points with every menu purchase
                </Text>
              </View>
              <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>+1</Text>
              </View>
            </View>

            <View style={styles.methodCard}>
              <View style={styles.methodIconContainer}>
                <ShoppingBag size={28} color={Colors.white} />
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Shop Merchandise</Text>
                <Text style={styles.methodDescription}>
                  Earn points with every merch purchase
                </Text>
              </View>
              <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>+2</Text>
              </View>
            </View>

            <View style={styles.methodCard}>
              <View style={styles.methodIconContainer}>
                <Star size={28} color={Colors.white} />
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Leave Reviews</Text>
                <Text style={styles.methodDescription}>
                  Share your experience and earn points
                </Text>
              </View>
              <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>+1</Text>
              </View>
            </View>
          </View>

          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>1. Purchase & Review:</Text> Buy items from the menu or merchandise store, then leave reviews to earn points.
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>2. Collect Points:</Text> Each action earns you points that count toward your next reward.
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>3. Unlock Rewards:</Text> Reach milestones to unlock exclusive rewards and special offers.
              </Text>
            </View>
          </View>

          <View style={styles.myRewardsSection}>
            <Text style={styles.sectionTitle}>AVAILABLE REWARDS</Text>
            
            <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
              <View style={styles.rewardIcon}>
                <Coffee size={24} color={Colors.accent} />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardName}>Free Drink</Text>
                <Text style={styles.rewardDescription}>Any size beverage</Text>
              </View>
              <View style={styles.rewardStatus}>
                <Text style={styles.rewardStatusText}>Locked</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
              <View style={styles.rewardIcon}>
                <ShoppingBag size={24} color={Colors.accent} />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardName}>10% Off Merch</Text>
                <Text style={styles.rewardDescription}>Any merchandise item</Text>
              </View>
              <View style={styles.rewardStatus}>
                <Text style={styles.rewardStatusText}>Locked</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rewardCard} activeOpacity={0.8}>
              <View style={styles.rewardIcon}>
                <Gift size={24} color={Colors.accent} />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardName}>Exclusive Item</Text>
                <Text style={styles.rewardDescription}>Limited edition merch</Text>
              </View>
              <View style={styles.rewardStatus}>
                <Text style={styles.rewardStatusText}>Locked</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push('/(tabs)/store')}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaButtonText}>Browse Store</Text>
              <ChevronRight size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
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
  content: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  progressSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.accent,
  },
  progressBarContainer: {
    marginVertical: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressNote: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  earnMethodsSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 16,
  },
  methodIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodContent: {
    flex: 1,
    gap: 4,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  methodDescription: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },
  methodBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  methodBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  howItWorksSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
    fontWeight: '500',
  },
  infoTextBold: {
    fontWeight: '800',
    color: Colors.accent,
  },
  myRewardsSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 16,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardContent: {
    flex: 1,
    gap: 2,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  rewardDescription: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  rewardStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  rewardStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
  },
  ctaSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
});
