/* eslint no-console:0 */
//
// Use a Custom Resource Definition to extend the Kubernetes API and the client.
//
const Client = require('kubernetes-client').Client

const YAML = require('yaml')
const fs = require('fs')
const path = require('path')
const file = fs.readFileSync('./crd.yaml', 'utf8')
const crds = YAML.parseAllDocuments(file)

const {
    KubeConfig
} = require('kubernetes-client')
const config = new KubeConfig()
config.loadFromFile(path.resolve(__dirname, './kubeconfig'))

for (let crd of crds) {
    main(crd)
}

async function main(crd) {
    try {
        const client = new Client({
            config,
            version: '1.9'
        })

        //
        // Create the CRD with the Kubernetes API
        //
        const create = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.post({
            body: crd
        })
        console.log('Create: ', create)

        //
        // Add endpoints to our client
        //
        client.addCustomResourceDefinition(crd)

        //
        // List all the resources of the new type
        //
        const all = await client.apis['blueberry-stack.stackathon'].v1.namespaces('blueberry-stack').valueBase.get()
        console.log('All: ', all)

        //
        // Get a specific resources.
        //
        // const one = await client.apis['blueberry-stack.stackathon'].v1.namespaces('blueberry-stack').crontabs('foo').get()
        // console.log('One: ', one)
    } catch (err) {
        console.error('Error: ', err)
    }
}

main()