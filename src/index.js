const _ = require('underscore')

function hasValuedDeps(deps) {
  let intersection = _.intersection(config.valuedDeps, deps);
  if (intersection.length === 0) return false;
  return intersection;
}

// .then((reposWithDuplicates) => {
//   let ids = [];
//   let repos = reposWithDuplicates.filter((r) => {
//     if (_.contains(ids, r.id)) return false;
//     ids.push(r.id);
//     return true;
//   });

//   return repos;
// })
// .then((repos) => {
//   console.log(`\nFound ${repos.length} repos with listed Javascript dependencies`);
//   return repos.map((repo) => {

//     let packageDeps = (repo.package) ? repo.package.dependencies : {};
//     let packageDevDeps = (repo.package) ? repo.package.devDependencies : {};
//     let allDeps = Object.assign({}, packageDeps, packageDevDeps);
//     let has = hasValuedDeps(Object.keys(allDeps));

//     return Object.assign({}, repo, { valuedDeps: has });
//   });
// })
// .then((repos) => {
//   return {
//     withFrameworks: repos.filter((r) => r.valuedDeps ),
//     withoutFrameworks: repos.filter((r) => !r.valuedDeps )
//   };
// })
// .then((sortedRepos) => {
//   sortedRepos.withoutFrameworks.forEach((r) => {
//     console.log(`\t${r.name} doesn't use a front end framework`);
//   });

//   console.log('\n');

//   sortedRepos.withFrameworks.forEach((r) => {
//     console.log(`\t${r.name} uses the following frameworks:`)
//     r.valuedDeps.forEach((f) => {
//       console.log(`\t* ${f}`);
//     });
//   });

//   return sortedRepos.withFrameworks;
// })
// .then((reposWithFrameworks) => {
//   let sortedByFramework = {};
//   config.valuedDeps.forEach((d) => sortedByFramework[d] = []);

//   reposWithFrameworks.forEach((r) => {
//     r.valuedDeps.forEach((d) => {
//       sortedByFramework[d].push(r.name);
//     });
//   });
//   console.log('\nThe usage of each framework across the org')

//   for (f in sortedByFramework) {
//     let projects = sortedByFramework[f];
//     console.log(`\t${f} is used in ${projects.length} projects`);
//     if (projects.length > 0) {
//       projects.forEach((p) => {
//         console.log(`\t\t*${p}`);
//       });
//     }
//   }
// })
