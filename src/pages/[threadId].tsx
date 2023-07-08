import { GetStaticProps, NextPage } from 'next';
import { Thread as ThreadPost, ThreadsAPI } from 'threads-api';
import { Thread } from '@/components/Thread';

const threadsAPI = new ThreadsAPI();

type Props = {
  threadID: string;
  thread: ThreadPost;
};

export const getStaticProps: GetStaticProps<Props, { threadId: string }> = async (context) => {
  try {
    // const tweetAst = await fetchTweetAst(tweetId)
    const threadID = context.params?.threadId;
    if (!threadID) {
      console.log('[!] Thread ID not provided');
      return { notFound: true };
    }
    const postID = await threadsAPI.getPostIDfromThreadID(threadID);
    if (!postID) {
      console.log(
        '[!] Post ID not found with provided Thread ID (in threadsAPI.getPostIDfromThreadID):',
        threadID,
      );
      return { notFound: true };
    }
    const thread = await threadsAPI.getThreads(postID);
    const { containing_thread } = thread;

    return {
      props: {
        threadID,
        thread: containing_thread,
      },
      revalidate: 10,
    };
  } catch (err) {
    console.error('error fetching tweet', err);

    throw err;
  }
};

export async function getStaticPaths() {
  return {
    paths: ['/CuW23qzhIdJ'],
    fallback: true,
  };
}

const ThreadDetailPage: NextPage<Props> = (props) => {
  return (
    <div className="w-full bg-black flex items-center justify-center py-[36px] min-h-screen">
      <div className="flex max-w-xl mx-auto">{!!props.thread && <Thread thread={props.thread} />}</div>
    </div>
  );
};

export default ThreadDetailPage;
