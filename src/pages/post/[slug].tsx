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
  return(
    <>
      <title>{post.data.title} | SpaceTraveling</title>

      <Header />
      <img src={post.data.banner.url} alt="Banner" className={styles.bannerImg}  /> {/* May not work with .svg files */}

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

{/*           {
            Object.entries( post.data.content).map(content => {
              return(
                <h2>{content[1]}</h2> 
              )
            }) 
          } */}

        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType("posts", {});

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID("posts", String(slug));

  return {
    props: {
      response,
    },
    revalidate: 60 * 30, // 30 minutes
  }
};
