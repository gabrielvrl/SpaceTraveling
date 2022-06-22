import format from 'date-fns/format';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  id: string;
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  map(arg0: (post: Post) => void): any;
  next_page: string;
  results: Post[];
}

interface HomeProps {
  results: PostPagination;
}

export default function Home(postPagination : HomeProps) {
  return(
    <>
      <title>Posts | SpaceTravelling</title>

      <Header />
      

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            postPagination.results.map((post) => {
              return (
                <Link key={post.id} href={`/posts/${post.uid}`}>
                  <a>
                    <h3>{post.data.title}</h3>
                    <p>{post.data.subtitle}</p>
                    <div className={styles.authorAndPublicationDate}>
                      <time> <img src="/images/calendar.svg" alt="calendar" />
                        {
                          format(new Date(post.first_publication_date), 'd MMM YYY')
                        }
                      </time>
                      <h6> <img src="/images/user.svg" alt="user" /> {post.data.author}</h6>
                    </div>
                  </a>
                </Link>
              )
            })
          }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("posts");

  return {
    props: postsResponse
  }
};
