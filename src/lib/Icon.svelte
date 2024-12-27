<script lang="ts">
interface Props {
  use: string;
}
const { use } = $props()
</script>

<svg width="24" height="24" viewBox="0 0 24 24">
    <use href="#{use}" />
</svg>
