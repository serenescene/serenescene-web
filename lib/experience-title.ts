export function suggestedExperienceTitle(practiceName: string) {
  const trimmed = practiceName.trim();
  if (!trimmed) return "Your Serene Scene Chairside XR Experience";
  if (/serene scene/i.test(trimmed)) return trimmed;
  return `${trimmed}'s Serene Scene Chairside XR Experience`;
}
