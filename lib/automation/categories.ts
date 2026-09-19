// The categories the daily automation rotates through, in this exact order.
// next_category_index in automation_settings points into this array.
//
// NOTE: these are inserted into the `categories` table by
// supabase/automation-setup.sql using ON CONFLICT (slug) DO NOTHING, so if a
// category with the same slug already exists in your database, it is reused
// as-is (its existing name/icon win) and nothing is overwritten.

export type AutomationCategory = {
  slug: string;
  name: string;
  icon: string;
};

export const AUTOMATION_CATEGORIES: AutomationCategory[] = [
  { slug: "business-ideas", name: "Business Ideas", icon: "💡" },
  { slug: "low-investment-business", name: "Low Investment Business", icon: "💰" },
  { slug: "manufacturing", name: "Manufacturing", icon: "🏭" },
  { slug: "food-business", name: "Food Business", icon: "🍽️" },
  { slug: "shop-business", name: "Shop Business", icon: "🏪" },
  { slug: "service-business", name: "Service Business", icon: "🛠️" },
  { slug: "agriculture", name: "Agriculture", icon: "🌾" },
  { slug: "wholesale", name: "Wholesale", icon: "📦" },
  { slug: "online-business", name: "Online Business", icon: "💻" },
  { slug: "home-business", name: "Home Business", icon: "🏠" },
  { slug: "trending-business", name: "Trending Business", icon: "🔥" },
  { slug: "business-guide", name: "Business Guide", icon: "📘" },
];
