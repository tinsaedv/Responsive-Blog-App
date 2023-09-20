import { useArticleStore } from '../../../App/useArticleStore';
import { TagsInput } from 'react-tag-input-component';
const UpdateTags = () => {
  const { updateTags, setUpdateTags } = useArticleStore((state) => ({
    updateTags: state.updateTags,
    setUpdateTags: state.setUpdateTags,
  }));
  const tags = Array.isArray(updateTags) ? updateTags : [];

  return (
    <div className='lg:min-w-[80%] my-5'>
      <TagsInput
        className='w-10'
        name='article tags'
        placeHolder='Press enter to add your tags'
        value={tags}
        onChange={setUpdateTags}
      />
    </div>
  );
};

export default UpdateTags;
