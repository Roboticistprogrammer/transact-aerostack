import droneIcon from "@/assets/drone-icon.webp";

interface DroneIconProps {
  className?: string;
}

export function DroneIcon({ className = "h-4 w-4" }: DroneIconProps) {
  return (
    <img 
      src={droneIcon} 
      alt="Drone" 
      className={className}
      style={{ 
        filter: 'brightness(0) saturate(100%)',
        opacity: 0.9
      }}
    />
  );
}
