import { useGetCommunityQuery } from '@/api/queries/communityQuery';
import AvatarAndOptions from '@/components/CommunityPage/AvatarAndOptions';
import CommunityBanner from '@/components/CommunityPage/CommunityBanner';
import Loading from '@/components/Loading';
import { RootState } from '@/global/_store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CommunityPage = () => {
  const { name: communityName } = useParams();
  const { userId } = useSelector((state: RootState) => state.auth);

  const { data, isLoading } = useGetCommunityQuery(`${communityName}`);

  console.log(data);

  const isMod = userId === data?.author;

  if (isLoading) return <Loading isLoading={isLoading} />;

  return (
    <div className=''>
      <CommunityBanner />

      <AvatarAndOptions
        isMod={isMod}
        communityName={communityName}
        userId={userId}
      />
    </div>
  );
};
export default CommunityPage;
