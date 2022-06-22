import Head from 'next/head'
import {connectToDatabase} from '../lib/mongodb'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import styles from '../styles/Dashboard.module.css'
import CollapsibleTable from '../components/CollapsibleTable'

const Dashboard: NextPage<DashboardProps> = (props: DashboardProps) => {
  return props.isConnected? (
    <div className={styles.container}>
      <Head>
        <title>Silk Assignment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Silk Dashboard
        </h1>
        <div>
          <CollapsibleTable dataSet={props.groupedFindings}></CollapsibleTable>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  ): <div>loading...</div>
}

export const getServerSideProps: GetServerSideProps = async function getServerSideProps() {
  try {
    const { db } = await connectToDatabase();
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    const rawDump = await db
      .collection("raw")
      .find({})
      .filter({})
      // .sort({ metacritic: -1 })
      // .limit(20)
      .toArray()

    const groupedDump = await db
      .collection("grouped")
      .find({})
      // .sort({ metacritic: -1 })
      // .limit(20)
      .toArray();

    const raw: RawFinding[] = JSON.parse(JSON.stringify(rawDump));
    const grouped: GroupedFinding[] = JSON.parse(JSON.stringify(groupedDump));

    const groupedFindings: GroupedFindingWithRawData[] = grouped.map((finding: GroupedFinding) => ({
      ...finding,
      raw: raw.filter((finding: RawFinding) => finding.grouped_finding_id === finding.id)
    }))

    return {
      props: { isConnected: true, groupedFindings},
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

// bad types are bad
type GroupedFinding = {
  id: number,
  description?: string,
  grouped_finding_created?: string,
  grouping_key?: string,
  grouping_type?: string,
  owner?: string,
  progress?: number,
  security_analyst?: string,
  severity?: string,
  sla?: string,
  status?: string,
  workflow?: string
}

export type GroupedFindingWithRawData = GroupedFinding & { raw: RawFinding[] }

export type RawFinding = {
  grouped_finding_id: number,
  id: number,
  asset?: string,
  description?: string,
  finding_created?: string,
  remediation_text?: string,
  remediation_url?: string,
  severity?: string,
  source_collaboration_tool_id?: string,
  source_collaboration_tool_name?: string,
  source_security_tool_id?: string,
  source_security_tool_name?: string,
  status?: string,
  ticket_created?: string,
}

type DashboardProps = {
  groupedFindings: GroupedFindingWithRawData[],
  isConnected: true
} | { isConnected: false }

export default Dashboard;