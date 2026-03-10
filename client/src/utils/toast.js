import { toast } from 'react-toastify'

export function showSuccess(message) {
  toast.success(message)
}

export function showError(message) {
  toast.error(message)
}
