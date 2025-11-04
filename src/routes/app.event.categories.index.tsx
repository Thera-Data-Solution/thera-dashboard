import { CrudManager } from '@/components/crud/crudManager'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CrudManager
      title="Categories"
      endpoint={import.meta.env.VITE_BACKEND_URL + "/categories"}
      hasPagination={false}
      useFormData
      fields={[
        { name: "image", label: "Image", type: "file" },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "price", label: "Price", type: "number" },
        { name: "location", label: "Location", type: "text" },
        { name: "isFree", label: "Is Free", type: "checkbox" },
        { name: "disable", label: "Disable", type: "checkbox" },
      ]}
    />
}
