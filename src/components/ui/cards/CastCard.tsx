interface CastCardProps {
  name: string;
}

function CastCard({ name }: CastCardProps) {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const getAvatarUrl = (fullName: string): string => {
    const initials = getInitials(fullName);

    const colors = [
      { bg: "00A6E8", color: "FFFFFF" },
      { bg: "2092BF", color: "FFFFFF" },
      { bg: "192BC2", color: "FFFFFF" },
      { bg: "150578", color: "FFFFFF" },
      { bg: "0E0E52", color: "FFFFFF" },
    ];

    const colorIndex = fullName.length % colors.length;
    const selectedColor = colors[colorIndex];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=${selectedColor.bg}&color=${
      selectedColor.color
    }&size=128&bold=true`;
  };

  return (
    <div className="flex items-center gap-3 p-4  dark:bg-gray-700 rounded-xl shadow-sm bg-white">
      <img
        src={getAvatarUrl(name)}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
      />
      <p className=" dark:text-white font-medium">{name}</p>
    </div>
  );
}

export default CastCard;
