import { useArticleStore } from '../../App/useArticleStore';
import { TagsInput } from 'react-tag-input-component';
const Tags = () => {
  const { tags, setTags } = useArticleStore((state) => ({
    tags: state.tags,
    setTags: state.setTags,
  }));

  const tagsChecked = Array.isArray(tags) ? tags : [];

  return (
    <div className='lg:min-w-[80%] my-5 dark:text-black'>
      <TagsInput
        className='w-10 dark:text-black'
        onChange={setTags}
        value={tagsChecked}
        name='article tags'
        placeHolder='Press enter to add your tags'
      />
    </div>
  );
};

export default Tags;
