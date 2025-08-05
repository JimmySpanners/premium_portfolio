import ContactForm from '@/components/contact/ContactForm';
import { useAuth } from '@/components/providers/AuthProvider';
import { Section } from '@/app/custom_pages/types/sections';

interface FluxeditaAdvancedFormSectionProps {
  section: Section;
  isEditMode: boolean;
  onSectionChange: (updatedSection: Section) => void;
}

export default function FluxeditaAdvancedFormSection({
  section,
  isEditMode,
  onSectionChange,
}: FluxeditaAdvancedFormSectionProps) {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="my-8">
      <ContactForm isAuthenticated={isAuthenticated} user={user} />
    </div>
  );
}