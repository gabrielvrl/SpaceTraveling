import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import { api } from '../services/api';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<PostPagination>(
    postsPagination,
  )
  
  const handleLoadMorePosts = async () => {
    await fetch(postsPagination.next_page)
      .then(data=>{return data.json()})
      .then(response=>{
        setPosts({
          next_page: response.next_page,
          results: [...posts.results, ...response.results]
        })
      })
  }

  return(
    <>
      <title>Posts | SpaceTravelling</title>

      <Header />
      

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {
            posts.results.map((post) => {
              return (
                <Link key={post.uid} href={`/post/${post.uid}`}>
                  <a>
                    <h3>{post.data.title}</h3>
                    <p>{post.data.subtitle}</p>
                    <div className={commonStyles.postInfo}>
                      <time> <img src="/images/calendar.svg" alt="calendar" />
                        {
                          format(
                            new Date(post.first_publication_date), 
                            'd MMM YYY',
                            {
                              locale: ptBR
                            }
                          )
                        }
                      </time>
                      <h6> <img src="/images/user.svg" alt="user" /> {post.data.author}</h6>
                    </div>
                  </a>
                </Link>
              )
            })
          }

          {
            posts.next_page &&
              <div className={styles.morePosts} onClick={handleLoadMorePosts}>
                <h4>Carregar mais posts</h4>
              </div>
          }

        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false, previewData }) => {
  const prismic = getPrismicClient({ previewData });
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 2,
    ref: previewData?.ref ?? null
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results
  }

  return {
    props: {
      postsPagination,
      preview,
    },
    revalidate: 60 * 5, // 5 minutes
  }
};
