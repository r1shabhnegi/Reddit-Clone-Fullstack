import MoonLoader from "react-spinners/MoonLoader";
const PageLoader = ({ size }: { size?: number }) => {
  return (
    <div className='flex items-center justify-center w-full min-h-screen'>
      <MoonLoader
        color='#f2f2f1'
        loading={true}
        size={size || 50}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
};
export default PageLoader;
