import { useUser } from "@clerk/clerk-react";
import { Mail, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePersonalInfoSection() {
  const { user, isLoaded, isSignedIn } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    });
  }, [reset, user]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      return;
    }

    try {
      await user.update({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || undefined,
      });

      await user.reload();
      reset({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() ?? "",
      });
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Unable to update profile. Please try again.");
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "No verified email available";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h2 className="text-xl mb-6 flex items-center gap-2">
        <User className="w-5 h-5" />
        Personal Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              {...register("firstName")}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {errors.firstName?.message && (
            <p className="mt-2 text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              {...register("lastName")}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {errors.lastName?.message && (
            <p className="mt-2 text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Primary Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={primaryEmail}
              readOnly
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}
