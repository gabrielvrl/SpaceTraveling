import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  console.log(post)
  return(
    <>
      <title>{post.data.title} | SpaceTraveling</title>

      <Header />
      <img src={post.data.banner.url} alt="Banner" width="100%" height="100%" /> {/* May not work with .svg files */}

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>

          <div className={commonStyles.postInfo}>
            <time> <img src="/images/calendar.svg" alt="calendar" />
              {
                format(new Date(post.first_publication_date), 'd MMM YYY')
              }
            </time>
            <h6> <img src="/images/user.svg" alt="user" /> {post.data.author}</h6>
            <h6> <img src="/images/clock.svg" alt="user" /> 4 min</h6>
          </div>
          
  {/*         <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.data.content }} 
          /> */}
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType("posts", {});

  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID("posts", String(slug));
  console.log(response)

  const post = {
/*     slug,
    title: response.data.title,
    content: response.data.content,
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) */
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        heading: null /* response.data.content.heading */,
        body: {
          text: null /* response.data.content.body?.text */,
        },
      },
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  }
};
