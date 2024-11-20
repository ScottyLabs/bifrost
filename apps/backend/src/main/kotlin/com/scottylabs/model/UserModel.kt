
@Entity
data class User(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	var id: Long = 0,
	var username: String = "",
	var status: String
) {
}