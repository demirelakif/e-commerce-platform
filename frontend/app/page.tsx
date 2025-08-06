import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-16 bg-primary-600">
        <div className="container-custom">
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
} 