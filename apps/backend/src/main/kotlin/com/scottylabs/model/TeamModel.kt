package com.scottylabs.Team

data class Team(
		var name: String = "",
		var members: MutableList<User> = mutableListOf(),
		var id: Long = 0
		var open: Boolean = false
)