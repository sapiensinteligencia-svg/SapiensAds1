export function parseApiError(err, status) {
  if (!status && err?.message?.includes('fetch')) {
    return {
      message: 'Sin conexión. Verifica tu internet e intenta de nuevo.',
      type: 'warning',
      retryable: true,
    }
  }

  switch (status) {
    case 401:
      return {
        message: 'Tu sesión expiró. Vuelve a iniciar sesión.',
        type: 'error',
        retryable: false,
        action: 'logout',
      }
    case 403:
      return {
        message: 'No tienes créditos disponibles. Actualiza tu plan para continuar.',
        type: 'warning',
        retryable: false,
        action: 'pricing',
      }
    case 503:
      return {
        message: 'El modelo de IA está ocupado. Reintentando en unos segundos...',
        type: 'info',
        retryable: true,
      }
    case 500:
      return {
        message: 'Hubo un error al generar. Intenta de nuevo.',
        type: 'error',
        retryable: true,
      }
    default:
      return {
        message: err?.message || 'Algo salió mal. Intenta de nuevo.',
        type: 'error',
        retryable: true,
      }
  }
}