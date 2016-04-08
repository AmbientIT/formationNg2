import { provideStore } from '@ngrx/store';
import {posts} from './post/post.reducer'
import {users} from './user/user.reducer'

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
// requires and returns all modules that match

const context = require.context('./', true, /^\.\/.*\.model.ts$/);

export const API_PROVIDERS = requireAll(context)
  .reduce((moduleArray, module) => {
    for (let i in module) {
      console.log(module[i])
      if (typeof module[i] === 'function')
        moduleArray.push(module[i])
    }
    return moduleArray
  }, [])
  .concat(provideStore({posts}, {users}))
