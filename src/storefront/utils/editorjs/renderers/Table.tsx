const TableRenderer = ({ data }) => {
	let content = null;
	if (data.content && Array.isArray(data.content)) {
		content = data.content.map((item: any, index: number) => {
			return (
				<tr key={index}>
					{Array.isArray(item) ? item.map((col: any, col_index: any) => {
						return index == 0 && data.withHeadings === true ?
							<th key={col_index} dangerouslySetInnerHTML={{ __html: col }} />
							:
							<td key={col_index} dangerouslySetInnerHTML={{ __html: col }} />
					}) : <></>}
				</tr>
			)
		});
	}

	return content !== null ? <table>{content}</table> : <></>;
}

export default TableRenderer;