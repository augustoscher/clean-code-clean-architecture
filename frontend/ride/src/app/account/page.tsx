// import Link from 'next/link'

// import Heading from 'components/Heading'
// import { fetchPokemon } from './fetch'

// import styles from "./Page.module.scss";

export default async function ServerComponentPage() {
  // const pokemons = await fetchPokemon()

  return (
    <div>
      <h1>Account Page</h1>
    </div>
  );
}

// <>
// <Heading size="medium">Pokemons</Heading>

// <div className={styles.subtitle}>
//   <p>Example of graphql pokemons request in a server components</p>
// </div>

// <div>
//   {pokemons.map(({ id, name, classification }) => {
//     return (
//       <Link
//         key={id}
//         href={{ pathname: `/pokemons/${name.toLowerCase()}` }}
//       >
//         <div className={styles.listItem}>
//           <p>Name: {name}</p>
//           <p>Class: {classification}</p>
//         </div>
//       </Link>
//     )
//   })}
// </div>
// </>
