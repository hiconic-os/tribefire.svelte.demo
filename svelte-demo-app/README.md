# TRIBEFIRE DEMO APP

## Get started

Install the dependencies...

```bash
cd svelte-demo-app
yarn install
```

to link typescript definitions run:

```bash
jinni assemble-js-deps
```

...then start:

```bash
yarn dev
```

NOTE: if your app are not started, try to remove ./lib/\_src then run `yarn dev` again

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src-svelte`, save it, and reload the page to see your changes.

NOTE!!!!
Before push it to git, you need to run

```bash
yarn build
```

you can use githook for that. eg.

```bash
cd .git/hooks
mv pre-commit.sample pre-commit
```

and replace content of pre-commit file:

```
#!/bin/bash
PWD=`pwd`
cmd="yarn"
echo "PWD: "$PWD""
if type $cmd >/dev/null 2>&1;
then
        if [ $PWD = "*svelte-demo-app*" ]
        then
                yarn build
                git add svelte-demo-app/src*
        else
                cd svelte-demo-app
                yarn build
                git add src*
        fi
    exit 0
else
        echo "$cmd not exist!"
        # commit anyway
        exit 0
fi
```
