type ReviewTagsProps = {
  tags: string[];
  setFieldValue?: (field: string, value: unknown) => void;
};

const ReviewTags = ({ tags, setFieldValue }: ReviewTagsProps) => {
  const handleRemove = (tagToRemove: string) => {
    if (setFieldValue)
      setFieldValue(
        "tags",
        tags.filter((t) => t !== tagToRemove)
      );
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 rounded-2xl border border-primary text-primary font-light py-2 px-3 text-sm"
        >
          {tag}
          {setFieldValue && (
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="ml-1 text-blue-500 font-bold hover:text-blue-700"
              aria-label={`Remove tag ${tag}`}
            >
              x
            </button>
          )}
        </span>
      ))}
    </div>
  );
};

export default ReviewTags;
