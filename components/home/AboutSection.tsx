import Image from 'next/image';
import { MaskReveal, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="section bg-cream-section">
      <div className="container split-layout">
        <MaskReveal className="w-full">
          <Image src="/about-image.jpg" alt="Aryan Sharma, Founder of Apex Himalayan Rides" width={800} height={600} priority style={{ borderRadius: '8px', width: '100%', height: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
        </MaskReveal>
        
        <StaggerContainer>
          <StaggerItem>
            <h2 className="headline mb-8">Born in the Mountains</h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mb-4" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>&quot;It started with a single Royal Enfield, a map that was mostly wrong, and a desire to see what lay beyond the next pass.&quot;</p>
          </StaggerItem>
          <StaggerItem>
            <p className="mb-4">I founded Apex Himalayan Rides in 2018 after spending a decade exploring every hidden valley and high-altitude pass in the Indian Himalayas. What began as personal expeditions with friends slowly evolved into a mission: to share the raw, unfiltered beauty of these mountains with riders from around the world.</p>
          </StaggerItem>
          <StaggerItem>
            <p className="mb-8">We don&#39;t do &#39;tourist&#39; routes. We do real adventure. We partner with local mechanics, stay in family-run heritage homes, and ride the roads that challenge you. Because that&#39;s where the real stories are made.</p>
          </StaggerItem>
          <StaggerItem>
            <p className="label text-gold">— Aryan Sharma, Founder</p>
          </StaggerItem>
        </StaggerContainer>
      </div>

    </section>
  );
}
