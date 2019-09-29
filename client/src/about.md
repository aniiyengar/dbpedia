# About dbpedia

**dbpedia** is a distributed wiki built on top of the Dropbox API. When you edit a wiki page, instead of changing some file or database entry on our servers, we just save your changes to your Dropbox account.

When you sign in with Dropbox, we create a folder that contains the edits you've made to any wiki page. When someone loads a page, we scour the editors' Dropbox accounts and fetch those diffs to reconstruct the page's content. This is why we ask you to sign into dbpedia using your Dropbox account.

We store all your edits in a folder in your Dropbox called `dbpedia_data`. For each page request, we look at who edited the page, and overlay the diffs on top of each other. To avoid synchronization conflicts (i.e. two people edit the page at the same time) we store the diff along with the hash of the previous wiki page. This means that if you delete your `dbpedia_data` folder, you will break the "chain" of diffs because we will lose the hash, and the page content will be reverted a state before your first edit.

## Source code

This is all on GitHub. To see how it works you can view the source [here](https://github.com/aniiyengar/dbpedia). The app is written using Go and ES6.
