# Onboarding Illustrations

This directory should contain the SVG illustrations for the onboarding flow.

## Required Files

The following SVG files are needed for the onboarding screens:

1. `astronaut.svg` - Astronaut with flag illustration (Slide 1)
2. `notifications.svg` - Person with notification icons (Slide 2)
3. `progress.svg` - Person with checklist/progress indicators (Slide 3)
4. `chat.svg` - Mobile phone with login/chat interface (Slide 4)

## Recommended Specifications

- **Format:** SVG (vector)
- **Size:** Approximately 400-500px height
- **Style:** Match Kibi brand colors (Blue #171B22, Green #95C16B)
- **Background:** Transparent

## Current Status

Currently using emoji placeholders in the onboarding flow:
- Astronaut: 🚀
- Notifications: 🔔
- Progress: ✅
- Chat: 💬

## Export from Figma

To export the illustrations from Figma:

1. Select the illustration frame in Figma
2. Right-click > Copy/Paste as > Copy as SVG
3. Save the SVG content to the appropriate filename in this directory
4. Update the `illustration` paths in `/app/onboarding/page.tsx`

## File Paths

The illustrations are referenced in the code as:
- `/illustrations/astronaut.svg`
- `/illustrations/notifications.svg`
- `/illustrations/progress.svg`
- `/illustrations/chat.svg`
