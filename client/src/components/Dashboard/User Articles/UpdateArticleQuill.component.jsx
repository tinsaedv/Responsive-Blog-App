import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useArticleStore } from '../../../App/useArticleStore';

const UpdateArticleQuill = () => {
  const { updateBody, setUpdateArticle } = useArticleStore((state) => ({
    updateBody: state.updateBody,
    setUpdateArticle: state.setUpdateArticle,
  }));

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
      ['clean'],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'link',
    'font',
    'align',
    'color',
    'background',
  ];

  return (
    <main className={`min-w-[80%] grid place-items-center  `}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='  bg-[#ffffff] shadow-lg top-[10%] left-[20%] rounded-lg   w-[80%]  h-[24.4rem] sm:h-[26rem] md:h-[25rem]'
      >
        <ReactQuill
          className='h-[17rem] dark:text-black   sm:h-[20rem] md:h-[21rem] outline-none border-none'
          modules={modules}
          theme='snow'
          value={updateBody}
          onChange={setUpdateArticle}
          formats={formats}
          placeholder={'Write something or insert a star ★'}
        />
      </div>
    </main>
  );
};

export default UpdateArticleQuill;
