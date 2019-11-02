// This example is written in Jsonnet (a JSON templating language),
// but you can write hooks in any language.
function(request) {
  local pod = request.object,
  local labelKey = pod.metadata.annotations["pod-name-label"],

  // Inject the Pod name as a label with the key requested in the annotation.
  labels: {
    [labelKey]: pod.metadata.name
  }
}