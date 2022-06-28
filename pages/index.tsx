import Head from 'next/head'
import type { NextPage } from 'next'
import styles from '../styles/Dashboard.module.css'
import { useEffect, useState } from 'react'
import { FormProps } from '../types/types'

const Dashboard: NextPage<FormProps> = (props: FormProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Novata Assignment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          hello world
        </div>

        <div className={styles.findingstable}>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Dashboard;