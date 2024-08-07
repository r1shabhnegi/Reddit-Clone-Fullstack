import { useCreatePostMutation } from "@/api/queries/postQuery";
import CommonLoader from "@/components/CommonLoader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppDispatch, RootState } from "@/global/_store";
import { showToast } from "@/global/toastSlice";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { MdAddPhotoAlternate } from "react-icons/md";

const Submit = () => {
  const [selectOption, setSelectOption] = useState<string>("");
  const [disableSelect, setDisableSelect] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { register, handleSubmit } = useForm();

  const { userCommunitiesList, modCommunitiesList } = useSelector(
    (state: RootState) => state.community
  );

  useEffect(() => {
    if (state) {
      setSelectOption(state.communityName);
      setDisableSelect(true);
    }
  }, [disableSelect, state]);

  useEffect(() => {
    if (state === null) setSelectOption("Choose a community");
  }, [state]);

  const [createPost, { isLoading }] = useCreatePostMutation();

  const [image, setImage] = useState<{ File: object; preview: string }>();

  const onDropAvatar = useCallback((acceptedFiles: File[]) => {
    setImage({
      File: acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
  }, []);
  const { getRootProps, isDragActive, getInputProps } = useDropzone({
    onDrop: onDropAvatar,
    maxSize: 1024 * 4000,
  });

  const onSubmit = handleSubmit(async (data) => {
    if (selectOption !== "Choose a community") {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
      };

      try {
        const postImage =
          image?.File instanceof File &&
          (await imageCompression(image?.File, options));

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("communityName", selectOption);
        postImage && formData.append("image", postImage);

        const res = await createPost(formData).unwrap();
        if (res) {
          dispatch(
            showToast({
              message: "Post Created Successfully!",
              type: "SUCCESS",
            })
          );
        }
        navigate(`/community/${selectOption}`);
      } catch (error) {
        dispatch(
          showToast({
            message: "Error posting!",
            type: "ERROR",
          })
        );
      }
    } else {
      dispatch(showToast({ message: "Select Community", type: "ERROR" }));
    }
  });

  return (
    <div className=' bg-[#030303] py-8 text-[#f2f2f1] flex items-start justify-center'>
      <div className='w-[45rem] mr-2 lg:mr-5  ml-2'>
        <h1 className='px-1 font-semibold py-3 border-b-[.1rem] border-gray-700'>
          Create a post
        </h1>

        <div className='mt-5 w-72 mb-2 bg-[#1A1A1B] p-3'>
          <select
            disabled={disableSelect}
            value={selectOption}
            onChange={(e) => setSelectOption(e.target.value)}
            className='bg-[#1A1A1B] w-full outline-none'>
            {selectOption && (
              <option
                disabled={true}
                className='hidden'>
                {selectOption}
              </option>
            )}
            <option
              disabled={true}
              className='bg-gray-700'>
              Communities you follow ▼
            </option>
            {userCommunitiesList?.map(
              ({ name, _id }) =>
                selectOption !== name && <option key={_id}>{name}</option>
            )}
            <option
              disabled={true}
              className='bg-gray-700'>
              Your communities ▼
            </option>
            {modCommunitiesList?.map(
              ({ name, _id }) =>
                selectOption !== name && <option key={_id}>{name}</option>
            )}
          </select>
        </div>

        <div className=' bg-[#1A1A1B] rounded-lg p-3 '>
          <form
            className='flex flex-col gap-8'
            onSubmit={onSubmit}>
            <label className='pb-3 text-sm font-semibold'>
              Title
              <Input
                {...register("title")}
                className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
                placeholder='Title'
              />
            </label>
            <label className='pb-3 text-sm font-semibold '>
              Description
              <Textarea
                {...register("content")}
                rows={8}
                className='border-[.1rem] border-gray-700 bg-[#1A1A1B]'
                placeholder='Text...'
              />
            </label>
            <label className='flex flex-col text-[#67787e] text-sm'>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Avatar Image
              <div
                {...getRootProps({
                  className: `rounded-3xl flex mt-1 flex bg-[#1A1A1B] justify-center items-center size-32 ${
                    !image?.preview && "border border-gray-700"
                  }`,
                })}
                onClick={() => console.log("c")}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className='font-bold text-gray-700'>Drop</p>
                ) : (
                  <div className='flex items-center justify-center'>
                    {image?.preview ? (
                      <img
                        src={image?.preview}
                        alt='avatar img'
                        className='object-cover object-center rounded-3xl size-32'
                      />
                    ) : (
                      <MdAddPhotoAlternate className='size-16' />
                    )}
                  </div>
                )}
              </div>
            </label>

            <div className='flex justify-end gap-5 mt-3'>
              {isLoading ? (
                <CommonLoader isLoading={isLoading} />
              ) : (
                <>
                  <button
                    className='px-5 py-3 bg-[#223237] rounded-2xl'
                    type='button'
                    disabled={isLoading}
                    onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    className='px-5 py-3 bg-[#0045ac] hover:bg-[#0079d3] rounded-2xl'>
                    Submit
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      <span className='bg-[#1A1A1B] hidden lg:block  rounded-lg p-4 mt-9 my-5  mr-2'>
        <h1 className='text-lg font-semibold border-b-[0.1rem] border-gray-700 py-2 text-[#D7DADC]'>
          Posting to Reddit
        </h1>
        <p className='font-semibold border-b-[0.1rem] py-2 border-gray-700'>
          1. Remember the human
        </p>
        <p className='font-semibold border-b-[0.1rem] py-2 border-gray-700'>
          2. Behave like you would in real life
        </p>
        <p className='font-semibold border-b-[0.1rem] py-2 border-gray-700'>
          3. Look for the original source of content
        </p>
        <p className='font-semibold border-b-[0.1rem] py-2 border-gray-700'>
          4. Search for duplicates before posting
        </p>
        <p className='font-semibold border-b-[0.1rem] py-2 border-gray-700'>
          5. Read the community’s rules
        </p>
      </span>
    </div>
  );
};
export default Submit;
