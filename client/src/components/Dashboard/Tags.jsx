import { useArticleStore } from '../../App/useArticleStore';
import { TagsInput } from 'react-tag-input-component';
const Tags = () => {
  const { tags, setTags, removeTags } = useArticleStore((state) => ({
    tags: state.tags,
    setTags: state.setTags,
    removeTags: state.removeTags,
  }));

  const tagsChecked = Array.isArray(tags) ? tags : [];

  console.log('tags', tagsChecked);

  return (
    <div className='lg:min-w-[80%] my-5'>
      <TagsInput
        className='w-10'
        onChange={setTags}
        value={tagsChecked}
        name='article tags'
        placeHolder='Press enter to add your tags'
      />
    </div>
  );
};

export default Tags;
